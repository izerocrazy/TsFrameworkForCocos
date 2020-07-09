export interface IUITouchInteractionComponent {
    onTouchStart (event: any);
    onTouchEnd (event: any);
    onTouchMove (event: any);
    onTouchCancel (event: any);

    addTouchStartCallback (func: Function);
    addTouchEndCallback (func: Function);
    addTouchMoveCallback (func: Function);
    addTouchCancelCallback (func: Function);

    removeTouchStartCallback (func: Function);
    removeTouchEndCallback (func: Function);
    removeTouchMoveCallback (func: Function);
    removeTouchCancelCallback (func: Function);
}
