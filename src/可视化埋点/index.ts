import DomInspector from "./main";

declare global {
    interface Window {
        inspector: DomInspector;
    }
} 

window.inspector = new DomInspector({
    maxZIndex: 9999,
    onMoveSelect: (target) => {
        console.log(target);
    },
    onDidSelect: (target) => {
        console.log(target);
        window.inspector.pause();
    }
});
