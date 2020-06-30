export default interface IBehavior {
    getName(): string;
    init(data);
    uninit();
    update();
}
