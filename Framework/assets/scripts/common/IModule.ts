export default interface IModule {
    Init(name:string);
    Update();

    GetName() : string;
}