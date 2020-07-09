import { IUITouchInteractionComponent } from "./IUITouchInteractionComponent";

export interface IUIPlacedComponent {
    removeToucher (toucher: IUITouchInteractionComponent);
    addToucher (toucher: IUITouchInteractionComponent);
    isCanAddToucher (toucher: IUITouchInteractionComponent);
    isToucherNearby (toucher: IUITouchInteractionComponent);
    addSetToucherCallback (func: Function);
    addRemoveToucherCallback (func: Function);
    removeSetToucherCallback (func: Function);
    removeRemoveToucherCallback (func: Function);
}
