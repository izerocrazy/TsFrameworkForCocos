export default interface IBehavior {
    getName(): string;
    Init(data);
    Uninit();
    Update();
}