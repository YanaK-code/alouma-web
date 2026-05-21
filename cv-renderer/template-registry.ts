export type ResumeTemplateKey = "novo_classic" | "structured" | "expressive";

export type ResumeTemplateDescriptor = {
  key: ResumeTemplateKey;
  rendererKey: "essentialNovoClassic" | "structured";
  implemented: boolean;
};

const essentialDescriptor: ResumeTemplateDescriptor = {
  key: "novo_classic",
  rendererKey: "essentialNovoClassic",
  implemented: true,
};

const descriptors: Record<ResumeTemplateKey, ResumeTemplateDescriptor> = {
  novo_classic: essentialDescriptor,
  structured: {
    key: "structured",
    rendererKey: "structured",
    implemented: true,
  },
  expressive: {
    key: "expressive",
    rendererKey: "essentialNovoClassic",
    implemented: false,
  },
};

export function normalizeTemplateKey(value: string | undefined): ResumeTemplateKey {
  if (value === "structured" || value === "expressive" || value === "novo_classic") {
    return value;
  }

  return "novo_classic";
}

export function resolvedDescriptor(template: string | undefined) {
  const descriptor = descriptors[normalizeTemplateKey(template)];

  if (!descriptor.implemented) {
    return essentialDescriptor;
  }

  return descriptor;
}
