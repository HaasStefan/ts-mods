import ts from 'typescript';

/**
 * 1. traverse imports and create a hashmap <key: CardsComponent, value: ['../pages/cards.component.ts', ts.node]>
 * 2. traverse routes object and replace "component:" with loadComponent: () => import(...)
 */


export default class AngularLoadComponentTransformer {
    readonly importMap = new Map<string, [string, ts.Node]>();

    readonly transformToLoadComponent =
        (context: ts.TransformationContext) => (rootNode: ts.Node) => {
            const visit = (node: ts.Node): ts.Node => {
                const newNode = ts.visitEachChild(node, visit, context);

                if (ts.isImportDeclaration(newNode)) {
                    const importClause = newNode.importClause;
                    const module = newNode.moduleSpecifier && ts.isStringLiteral(newNode.moduleSpecifier) ?
                        newNode.moduleSpecifier.text
                        : "undefined";

                    if (importClause && importClause.namedBindings && ts.isNamedImports(importClause.namedBindings)) {
                        importClause.namedBindings.elements.forEach((element) => {
                            this.importMap.set(element.name.text, [module, element]);
                        });
                    }
                }



                return newNode;
            };

            return ts.visitNode(rootNode, visit);
        };

}
