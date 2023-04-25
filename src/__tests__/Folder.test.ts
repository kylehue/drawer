/**
 * @vitest-environment jsdom
 */

import { describe, expect, test, afterAll, afterEach } from "vitest";
import { Drawer } from "../Drawer.js";
import { Folder } from "../Folder.js";
import { File } from "../File.js";

let drawer = new Drawer();
let folderA = drawer.root.add("/src", "folder");
let folderB = drawer.root.add("/src/classes/comps", "folder");
let fileA = folderA.add("memo.txt");
let fileB = folderA.add("/src/classes/comps", "file");

afterAll(() => {
   drawer.root.clear();
});

afterEach(() => {
   drawer.root.delete();
   folderA = drawer.root.add("/src", "folder");
   folderB = drawer.root.add("/src/classes/comps", "folder");
});

describe("Folder.add()", () => {
   describe(`Giver folderA '${folderA.source}' and folderB '${folderB.source}'`, () => {
      describe("ADD: Duplicates", () => {
         test("should NOT create a folder", () => {
            let classesFolder = folderA.get("classes", "folder");
            let newFolder = folderA.add("classes");

            expect(newFolder).toBe(classesFolder);
         });
      });

      describe("ADD: Explicit folder", () => {
         test("should create a folder in root named '/src/test.git'", () => {
            folderA.add("test.git", "folder");

            expect(drawer.items.get("/src/test.git")).toBeInstanceOf(Folder);
         });
      });

      describe("ADD: Implicit file", () => {
         test("should create a file in root named '/src/file.cpp'", () => {
            folderB.add("../../file.cpp");

            expect(drawer.items.get("/src/file.cpp")).toBeInstanceOf(File);
         });
      });

      describe("ADD: Implicit folder with file extension", () => {
         test("should create a folder, not a file", () => {
            let folder = folderA.add("test.txt/");

            expect(folder).toBeInstanceOf(Folder);
         });
      });

      describe("ADD: Explicit file", () => {
         test("should create a file in root named '/src/src'", () => {
            folderA.add("src", "file");

            expect(drawer.items.get("/src/src")).toBeInstanceOf(File);
         });
      });

      describe("ADD: Recursive folder creation", () => {
         test("should create 2 folders in root named '/src/styles' and '/src/styles/test' and 1 file named '/src/styles/test/file.css'", () => {
            drawer.root.add("src/styles/test/file.css");
            expect(drawer.items.get("/src/styles")).toBeInstanceOf(Folder);
            expect(drawer.items.get("/src/styles/test")).toBeInstanceOf(Folder);
            expect(
               drawer.items.get("/src/styles/test/file.css")
            ).toBeInstanceOf(File);
         });
      });
   });
});

describe("Folder.get()", () => {
   describe(`Giver folderA '${folderA.source}' and folderB '${folderB.source}'`, () => {
      describe("GET: Self", () => {
         test("should return itself", () => {
            expect(folderA.get("./")).toBe(folderA);
         });
      });

      describe("GET: Child", () => {
         test("should return a folder", () => {
            expect(folderA.get("/classes")).toBeInstanceOf(Folder);
         });
      });

      describe("GET: Implicit folder with file extension", () => {
         test("should return a folder", () => {
            folderA.add("test.hello/");
            expect(folderA.get("test.hello/")).toBeInstanceOf(Folder);
            expect(folderA.get("test.hello", "folder")).toBeInstanceOf(Folder);
            expect(folderA.get("test.hello")).toBeNull();
            expect(folderA.get("test.hello/", "file")).toBeNull();
         });
      });

      describe("GET: Child of child", () => {
         test("should return folderB", () => {
            expect(folderA.get("/classes/comps")).toBe(folderB);
         });
      });

      describe("GET: Parent", () => {
         test("should return the root", () => {
            expect(folderA.get("../")).toBe(drawer.root);
         });
      });

      describe("GET: Parent of parent", () => {
         test("should return folderA", () => {
            expect(folderB.get("../../")).toBe(folderA);
         });
      });
   });
});

describe("Folder.delete()", () => {
   describe(`Giver folderA '${folderA.source}' and folderB '${folderB.source}'`, () => {
      describe("when doing folderA.delete('classes/comps')", () => {
         test("should remove folderB but not the 'classes' folder", () => {
            folderA.delete("classes/comps");
            expect(drawer.items.get("/src/classes/comps")).toBeUndefined();
            expect(drawer.items.get("/src/classes")).toBeInstanceOf(Folder);
         });
      });

      describe("DELETE: Parent of parent", () => {
         test("should remove all items", () => {
            folderB.delete("../../");
            expect(drawer.items.size).toBe(0);
         });
      });

      describe("DELETE: Emptying", () => {
         test("should remove all items", () => {
            folderA.delete();
            expect(drawer.items.size).toBe(0);
         });
      });
   });
});
