import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const sourcePath = "/Users/daf2a/Documents/python/level-01/02-kondisional/slide/Conditional_Statements_Python.pptx";
const presentation = await PresentationFile.importPptx(await FileBlob.load(sourcePath));
const snapshot = await presentation.inspect({
  kind: "slide,textbox,shape,image,table,chart,notes,layout",
  maxChars: 24000,
});
console.log(snapshot.ndjson);
