"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackSchedulerObserverPanel = void 0;
const Panel_1 = require("./Panel");
class TrackSchedulerObserverPanel extends Panel_1.Panel {
    constructor(trackScheduler) {
        super();
        this.trackScheduler = trackScheduler;
    }
    startInternal() {
        this.trackScheduler.register(this);
    }
    onChange(trackScheduler) {
        this.update();
    }
    buildMessage() {
        return this.buildTrackMessage(this.trackScheduler);
    }
    destroyInternal() {
        this.trackScheduler.deregister(this);
    }
}
exports.TrackSchedulerObserverPanel = TrackSchedulerObserverPanel;
//# sourceMappingURL=TrackSchedulerObserverPanel.js.map