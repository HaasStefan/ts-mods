import ts from "typescript";
import * as fs from "node:fs";
import AngularLoadComponentTransformer from "./angular-load-component";

describe('AngularLoadComponentTransformer', () => {
    let printer: ts.Printer;
    let sourceFile: ts.SourceFile;
    let transformer: AngularLoadComponentTransformer;

    beforeEach(() => {
        printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed});

        const filename = "angular-load-component/mocks/routes.ts-mock";
        const code = fs.readFileSync(filename, "utf8");

        sourceFile = ts.createSourceFile(filename, code, ts.ScriptTarget.Latest);
        transformer = new AngularLoadComponentTransformer();
    });

    test('should have entries in importMap', () => {
        const transformationResult = ts.transform(sourceFile, [
            transformer.transformToLoadComponent,
        ]);

        expect(transformer.importMap.size).toBeGreaterThan(0);
    });
});
