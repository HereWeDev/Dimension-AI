import {
  SpecificationPart,
  SpecificationType,
} from "@/src/app/types/specification";

export function processSpec(specification: string): SpecificationType {
  const parts: string[] = specification
    .split("###")
    .filter((part: string): boolean => part.trim() !== "");

  const specificationParts: SpecificationPart[] = parts.map(
    (part: string): SpecificationPart => {
      const [heading, ...contentLines]: string[] = part.trim().split("\n");
      const content: string = contentLines.join("\n").trim();

      return {
        heading: `### ${heading.trim()}`,
        content,
      };
    }
  );

  return {
    originalText: specification,
    processedText: specificationParts,
  };
}
