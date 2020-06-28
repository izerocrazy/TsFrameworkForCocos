export default interface IModule {
    init(name:string);
    uninit();
    update();

    getName() : string;
}