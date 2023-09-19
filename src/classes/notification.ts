export class Notification {
  text: any;
  color: string;
  timeout: number;
  show = false;
  icon: string;
  y: string;
  x: string;
  constructor(
    text: string,
    color: string,
    timeout: number,
    show: boolean,
    icon: string,
    x: string,
    y: string
  ) {
    this.text = text;
    this.color = color;
    this.timeout = timeout;
    this.show = show;
    this.icon = icon;
    this.y = y;
    this.x = x;
  }
}
