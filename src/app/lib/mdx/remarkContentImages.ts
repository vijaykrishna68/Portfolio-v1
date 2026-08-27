import { Parser } from "acorn";
import { visit } from "unist-util-visit";

/**
 * Resolves relative image paths inside MDX bodies — `![alt](./cover.png)` —
 * the same way frontmatter `cover`/`gallery` fields already are, just via a
 * different mechanism: Vite only bundles images it sees as real `import`
 * statements, so this rewrites each relative image node into an injected
 * `import` plus a JSX `<img src={...}>`, using the same "inject an mdxjsEsm
 * node into the tree" technique remark-mdx-frontmatter already relies on for
 * the `export const frontmatter` line.
 *
 * Absolute URLs (`https://...`) are left untouched, mirroring resolveAsset().
 */
export function remarkContentImages() {
  return (tree: any) => {
    const imports: any[] = [];
    let counter = 0;

    visit(tree, "image", (node: any, index: number | undefined, parent: any) => {
      // Mirrors resolveAsset()'s own check: only relative paths are resolved,
      // absolute URLs pass through untouched.
      if (!node.url || !node.url.startsWith(".")) return;
      if (index === undefined || !parent) return;

      const identifier = `__mdxImage${counter++}`;
      imports.push(`import ${identifier} from ${JSON.stringify(node.url)};`);

      const identifierExpression = Parser.parseExpressionAt(identifier, 0, {
        ecmaVersion: "latest",
        sourceType: "module",
      });

      parent.children[index] = {
        type: "mdxJsxTextElement",
        name: "img",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "src",
            value: {
              type: "mdxJsxAttributeValueExpression",
              value: identifier,
              data: {
                estree: {
                  type: "Program",
                  sourceType: "module",
                  body: [{ type: "ExpressionStatement", expression: identifierExpression }],
                },
              },
            },
          },
          { type: "mdxJsxAttribute", name: "alt", value: node.alt ?? "" },
        ],
        children: [],
      };
    });

    if (imports.length > 0) {
      const program = Parser.parse(imports.join("\n"), {
        ecmaVersion: "latest",
        sourceType: "module",
      });

      tree.children.unshift({
        type: "mdxjsEsm",
        value: imports.join("\n"),
        data: { estree: program },
      });
    }
  };
}
