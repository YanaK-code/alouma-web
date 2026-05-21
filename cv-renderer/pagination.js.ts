export const sharedPaginationJS = `
(function () {
  var MAX_MOVES = 200;
  var MAX_TOTAL_PASSES = 1000;
  var UNSPLITTABLE_BLOCKS = {
    courses: true,
    education: true,
    awards: true
  };

  function pageContent(page) {
    return page && page.querySelector(".page-content");
  }

  function createPageAfter(page) {
    var next = page.nextElementSibling;
    if (next && next.classList && next.classList.contains("page")) {
      return next;
    }

    next = document.createElement("div");
    next.className = "page";
    var content = document.createElement("div");
    content.className = "page-content";
    next.appendChild(content);
    page.parentNode.insertBefore(next, page.nextSibling);
    return next;
  }

  function isOverflowing(page) {
    return page.scrollHeight > page.clientHeight + 1;
  }

  function sectionHeaderStartsTooLow(page, block) {
    var header = block.querySelector(".novo-section-header");
    if (!header) {
      return false;
    }

    var pageRect = page.getBoundingClientRect();
    var headerRect = header.getBoundingClientRect();
    return (headerRect.top - pageRect.top) > page.clientHeight * 0.75;
  }

  function cloneContinuationHeader(block) {
    var header = block.querySelector(".novo-section-header");
    return header ? header.cloneNode(true) : null;
  }

  function prependContinuationBlock(destContent, sourceBlock, entry) {
    var continuation = document.createElement("section");
    continuation.className = sourceBlock.className;
    continuation.setAttribute("data-block", sourceBlock.getAttribute("data-block") || "");

    var dataBlock = sourceBlock.getAttribute("data-block");
    if (dataBlock === "experience" || dataBlock === "volunteer") {
      var header = cloneContinuationHeader(sourceBlock);
      if (header) {
        continuation.appendChild(header);
      }
    }

    continuation.appendChild(entry);
    destContent.insertBefore(continuation, destContent.firstChild);
  }

  function moveLastEntryOrBlock(page, destPage) {
    var sourceContent = pageContent(page);
    var destContent = pageContent(destPage);
    if (!sourceContent || !destContent) {
      return false;
    }

    var blocks = Array.prototype.slice.call(sourceContent.querySelectorAll(".cv-block"));
    var block = blocks[blocks.length - 1];
    if (!block) {
      return false;
    }

    var dataBlock = block.getAttribute("data-block") || "";
    var entries = Array.prototype.slice.call(block.querySelectorAll(":scope > .novo-entry"));
    var shouldMoveWholeBlock =
      UNSPLITTABLE_BLOCKS[dataBlock] ||
      entries.length < 2 ||
      sectionHeaderStartsTooLow(page, block);

    if (!shouldMoveWholeBlock) {
      var entry = entries[entries.length - 1];
      block.removeChild(entry);
      prependContinuationBlock(destContent, block, entry);
      return true;
    }

    sourceContent.removeChild(block);
    destContent.insertBefore(block, destContent.firstChild);
    return true;
  }

  function removeEmptyPages() {
    var pages = Array.prototype.slice.call(document.querySelectorAll("#pages .page"));
    pages.forEach(function (page, index) {
      var content = pageContent(page);
      if (index > 0 && content && content.children.length === 0) {
        page.remove();
      }
    });
  }

  function packPages() {
    var totalPasses = 0;
    var pages = Array.prototype.slice.call(document.querySelectorAll("#pages .page"));

    for (var pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
      var page = pages[pageIndex];
      var moves = 0;

      while (isOverflowing(page) && moves < MAX_MOVES && totalPasses < MAX_TOTAL_PASSES) {
        var beforeHeight = page.scrollHeight;
        var nextPage = createPageAfter(page);
        if (pages.indexOf(nextPage) === -1) {
          pages.splice(pageIndex + 1, 0, nextPage);
        }

        if (!moveLastEntryOrBlock(page, nextPage)) {
          break;
        }

        moves += 1;
        totalPasses += 1;

        if (page.scrollHeight >= beforeHeight && moves > 1) {
          break;
        }
      }
    }

    removeEmptyPages();
    postPageMetrics();
  }

  function postPageMetrics() {
    var pages = Array.prototype.slice.call(document.querySelectorAll("#pages .page"));
    var currentPage = 1;
    var viewportMid = window.scrollY + window.innerHeight / 2;

    pages.forEach(function (page, index) {
      var rect = page.getBoundingClientRect();
      var top = rect.top + window.scrollY;
      var bottom = top + rect.height;
      if (viewportMid >= top && viewportMid <= bottom) {
        currentPage = index + 1;
      }
    });

    var payload = {
      type: "pageMetrics",
      pageCount: pages.length,
      currentPage: currentPage
    };

    window.__cvPageMetrics = payload;

    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.pageMetrics) {
      window.webkit.messageHandlers.pageMetrics.postMessage(payload);
    }

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ source: "alouma-cv", payload: payload }, "*");
    }
  }

  var scrollTimer = null;
  function onScroll() {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(postPageMetrics, 200);
  }

  window.__paginateCV = packPages;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    window.setTimeout(packPages, 50);
  });

  document.addEventListener("DOMContentLoaded", function () {
    var done = function () {
      window.setTimeout(packPages, 0);
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(done).catch(done);
    } else {
      done();
    }
  });
})();
`;
