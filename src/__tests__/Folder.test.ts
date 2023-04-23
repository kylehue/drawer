/**
 * @vitest-environment jsdom
 */

import { describe, expect, test, afterAll, afterEach } from "vitest";
import Drawer from "../Drawer.js";
import Folder from "../Folder.js";
import File from "../File.js";

let drawer = new Drawer();
let folderA = drawer.add("/src", "folder");
let folderB = drawer.add("/src/classes/comps", "folder");

afterAll(() => {
   drawer.clear();
});

afterEach(() => {
   drawer.delete();
   folderA = drawer.add("/src", "folder");
   folderB = drawer.add("/src/classes/comps", "folder");
});

describe("Folder.add()", () => {
   describe(`Giver folderA '${folderA.source}' and folderB '${folderB.source}'`, () => {
      // Duplicates
      describe("when doing folderA.add('classes')", () => {
         test("should NOT create a folder", () => {
            let classesFolder = folderA.get("classes", "folder");
            let newFolder = folderA.add("classes");

            expect(newFolder).toBe(classesFolder);
         });
      });

      // Explicit folder
      describe("when doing folderA.add('test.git', 'folder')", () => {
         test("should create a folder in root named '/src/test.git'", () => {
            folderA.add("test.git", "folder");

            expect(drawer.items.get("/src/test.git")).toBeInstanceOf(Folder);
         });
      });

      // Implicit file
      describe("when doing folderB.add('../../file.cpp')", () => {
         test("should create a file in root named '/src/file.cpp'", () => {
            folderB.add("../../file.cpp");

            expect(drawer.items.get("/src/file.cpp")).toBeInstanceOf(File);
         });
      });

      // Explicit file
      describe("when doing folderA.add('src', 'file')", () => {
         test("should create a file in root named '/src/src'", () => {
            folderA.add("src", "file");

            expect(drawer.items.get("/src/src")).toBeInstanceOf(File);
         });
      });

      // Recursive folder creation
      describe("when doing drawer.root.add('src/styles/test/file.css')", () => {
         test("should create 2 folders in root named '/src/styles' and '/src/styles/test' and 1 file named '/src/styles/test/file.css'", () => {
            drawer.add("src/styles/test/file.css");
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
      describe("when doing folderA.get('/')", () => {
         test("should return itself", () => {
            expect(folderA.get("./")).toBe(folderA);
         });
      });

      describe("when doing folderA.get('/classes')", () => {
         test("should return a folder", () => {
            expect(folderA.get("/classes")).toBeInstanceOf(Folder);
         });
      });

      describe("when doing folderA.get('/classes/comps')", () => {
         test("should return folderB", () => {
            expect(folderA.get("/classes/comps")).toBe(folderB);
         });
      });

      describe("when doing folderA.get('../')", () => {
         test("should return the root", () => {
            expect(folderA.get("../")).toBe(drawer.root);
         });
      });

      describe("when doing folderA.get('./')", () => {
         test("should return itself", () => {
            expect(folderA.get("./")).toBe(folderA);
         });
      });

      describe("when doing folderA.get('/')", () => {
         test("should return itself", () => {
            expect(folderA.get("/")).toBe(folderA);
         });
      });

      describe("when doing folderB.get('../../')", () => {
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

      describe("when doing folderB.delete('../../')", () => {
         test("should remove all items", () => {
            folderB.delete("../../");
            expect(drawer.items.size).toBe(0);
         });
      });

      describe("when doing folderA.delete()", () => {
         test("should remove all items", () => {
            folderA.delete();
            expect(drawer.items.size).toBe(0);
         });
      });
   });
});
