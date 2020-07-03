export default interface IBehavior {
    getName(): string;
    init(data : { name: string, data: any});
    uninit();
    update();
}
