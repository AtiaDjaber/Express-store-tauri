export default class SoundService {
  public static notifySound = new Audio(
    require("../../public/audio/notify.wav")
  );
  public static successSound = new Audio(
    require("../../public/audio/success.mp3")
  );
  public static failSound = new Audio(require("../../public/audio/fail.wav"));
  public static warningSound = new Audio(
    require("../../public/audio/warning.wav")
  );

  public static notify() {
    this.notifySound.play();
  }
  public static success() {
    this.successSound.play();
  }
  public static fail() {
    this.failSound.play();
  }
  public static warning() {
    this.warningSound.play();
  }
}
