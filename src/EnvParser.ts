import * as fs from "fs";
import * as p from "path";
import { ParserError } from "./ParserError";

export interface IEnvParserOptions {
  emptyValue?: boolean;
  lineSpace?: number;
  comments?: boolean;
  slug?: string;
}

export class EnvParser {
  public path: string | null;
  public absolutePath: string | null;
  public fileContent: string | null;
  public options: IEnvParserOptions;

  constructor(options?: IEnvParserOptions) {
    this.path = null;
    this.absolutePath = null;
    this.fileContent = null;
    this.options = options || {
      emptyValue: true,
      lineSpace: 1,
      comments: false,
      slug: "YOUR",
    };
  }

  private checkPath = (path: string) => {
    if (!path) {
      throw new ParserError("Path is empty");
    }
    if (!fs.existsSync(path)) {
      throw new ParserError(`Path: "${this.absolutePath}" does not exist`);
    }
    return true;
  };

  private checkFile = (path: string) => {
    if (!fs.lstatSync(path).isFile()) {
      throw new ParserError(`Path: "${this.absolutePath}" is not a file`);
    }
    return true;
  };

  private checkExtension = (path: string) => {
    if (path.split(".").pop() !== "env") {
      throw new ParserError(`Path: "${this.absolutePath}" is not a .env file`);
    }
    return true;
  };

  private checkFileContent = (path: string) => {
    const fileContent = fs.readFileSync(path, "utf8");
    if (!fileContent) {
      throw new ParserError("File is empty");
    }
    return true;
  };

  private verify = (path: string) => {
    return new Promise<string>((resolve, reject) => {
      this.path = path;
      try {
        this.absolutePath = p.resolve(path);
        this.checkPath(path);
        this.checkFile(path);
        this.checkExtension(path);
        this.checkFileContent(path);
        resolve(this.absolutePath);
      } catch (error) {
        reject(error);
      }
    });
  };
}