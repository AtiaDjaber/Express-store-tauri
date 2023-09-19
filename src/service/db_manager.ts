// import fs from "fs";
// import path from "path";
import moment from "moment";
// import { exec } from "child_process";

// Get the date of yesterday
const yesterday = moment().subtract(2, "day").startOf("day");

// Function to check if a file is older than yesterday
function isOlderThanYesterday(file: string) {
  // const fileStats = fs.statSync(file);
  // const fileModifiedTime = moment(fileStats.mtime).startOf("day");
  // return fileModifiedTime.isBefore(yesterday) && !file.includes("keep");
}

// Function to remove files older than yesterday
export function removeFilesOlderThanYesterday(): void {
  // setTimeout(() => {
  //   try {
  //     const directoryPath = "backup/";
  //     console.log(directoryPath);
  //     fs.readdir(directoryPath, (err, files) => {
  //       if (err) {
  //         console.error("Error reading directory:", err);
  //         return;
  //       }
  //       files.forEach((file) => {
  //         const filePath = path.join(directoryPath, file);
  //         if (isOlderThanYesterday(filePath)) {
  //           fs.unlink(filePath, (err) => {
  //             if (err) {
  //               console.error("Error removing file:", filePath, err);
  //             } else {
  //               console.log("Removed file:", filePath);
  //             }
  //           });
  //         }
  //       });
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, 19000);
}

// must file name not contains any spaces

export function createBackup(time = 0): Promise<unknown> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10);
      const db = "express_store";
      const backup = "backup/" + db + date + ".sql";
      console.log(backup);
      //  && gzip ${backup}

      // exec(
      //   `mysqldump -u root --default-character-set=utf8mb4 ${db} > ${backup}`,
      //   (error, stdout, stderr) => {
      //     if (error) {
      //       reject(error);
      //     } else {
      //       resolve({ stdout, stderr });
      //     }
      //   }
      // );
    }, time);
  });
}
