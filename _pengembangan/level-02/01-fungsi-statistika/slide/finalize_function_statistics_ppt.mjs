import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const { finalizePresentation } = await import(pathToFileURL(
  "/Users/daf2a/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations/container_tools/artifact_tool_utils.mjs",
).href);

const workspaceDir = "/Users/daf2a/Documents/python";
const stagingDir = "/Users/daf2a/Documents/python/_pengembangan/level-02/01-fungsi-statistika/slide";
const candidatePath = path.join(stagingDir, "function_statistika_deskriptif_candidate.pptx");
const finalPath = path.join(workspaceDir, "level-02/01-fungsi-statistika/slide", "function_statistika_deskriptif_v3.pptx");

await fs.mkdir(stagingDir, { recursive: true });

const result = await finalizePresentation({
  explicitTotalSlideCount: 14,
  requiredNativeTableOwnerSlides: [],
  requiredNativeChartOwnerSlides: [],
  workspaceDir,
  candidatePath,
  finalPath,
  pythonExecutable: "/Users/daf2a/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3",
  integrityValidatorPath: "/Users/daf2a/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations/container_tools/inspect_presentation_package_integrity.py",
  layoutValidatorPath: "/Users/daf2a/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations/container_tools/inspect_presentation_layout_geometry.py",
  layoutArgs: [
    "--expected-slide-size-emu", "12192000,6858000",
    "--validate-bullet-geometry",
    "--validate-heading-fit",
    "--validate-heading-punctuation",
  ],
  fontPolicy: {
    basis: "reference",
    families: ["SF Pro Display", "SF Pro Text", "SF Mono"],
    referencePath: "/Users/daf2a/Documents/python/level-01/03-perulangan/slide/For_While_Loop_Python.pptx",
    referenceSha256: "caeb7f22134c398e4a9b645ea98081e420a37d8eb00fce008a0964289dd9194c",
  },
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, "function_statistika_deskriptif_v3.validation.json"),
});

console.log(JSON.stringify(result, null, 2));
