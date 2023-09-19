// import AES from "crypto-js/aes";
// import Store from "electron-store";
// import ENC from "crypto-js/enc-utf8";

const currentDate = new Date();
// const store = new Store();
const trialDuration = 3; // 7 days trial

export function firstLaunch(): void {
  console.log("First-time launch");
  const startDate = currentDate.toISOString();

  const encryptedStartDate = encrypt(startDate);
  console.log(encryptedStartDate);
  // store.set("trialStartDate", encryptedStartDate);
}
export function encrypt(text: string): string {
  // const encrypted = AES.encrypt(text, "trial").toString();
  return "encrypted";
}

export function decrypt(encrypted: string): string {
  // const bytes = AES.decrypt(encrypted, "trial");

  // const originalText = bytes.toString(ENC);

  return "originalText";
}

// function showEndDialog(message, detail, type) {
//   const dialogOpts: Electron.MessageBoxOptions = {
//     type: type,
//     buttons: ["موافق"],
//     // title: `Update available for ${_event.releaseName}`,
//     title: `Express Store `,
//     message: message,
//     detail: detail,
//   };

//   dialog.showMessageBox(dialogOpts);
// }

export function checkTrialExpire(encryptedStartDate): number {
  const decryptedStartDate = decrypt(encryptedStartDate);

  // showEndDialog(
  //   "فترة تجريبية",
  //   +decryptedStartDate + " تاريخ البداية ",
  //   "info"
  // );
  const startDate = new Date(decryptedStartDate);

  const daysElapsed = Math.floor(
    ((currentDate as any) - (startDate as any)) / (1000 * 60 * 60 * 24)
  );

  return daysElapsed - trialDuration;
}
