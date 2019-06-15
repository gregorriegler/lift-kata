import FloorArrivalHandler = Lift.FloorArrivalHandler;

class Lift {
    private readonly boundary: Lift.Boundary;
    private readonly targets: number[] = [];
    private _floor: number = 0;
    private arrivalHandlers:FloorArrivalHandler[] = [];

    constructor(lowerBound: number, upperBound: number, ...handlers: FloorArrivalHandler[]) {
        this.boundary = new Lift.Boundary(lowerBound, upperBound)
        handlers.forEach(handler => this.arrivalHandlers.push(handler))
    }

    floor() {
        return this._floor
    }

    registerTarget(target: number) {
        this.boundary.assertInBounds(target)
        this.targets.push(target)
    }

    tick(times?: number) {
        if (times === undefined) times = 1
        for (let i = 0; i < times; i++)
            this._tick()
    }

    private _tick() {
        this.move();
        this.handleArrival();
    }

    private handleArrival() {
        if (this.currentTarget() !== this._floor) return;

        this.removeCurrentTarget()
        for (const handler of this.arrivalHandlers) {
            handler.arrivedAt(this._floor)
        }
    }

    private move() {
        if (this.currentTarget() > this._floor) {
            this._floor++;
        } else if (this.currentTarget() < this._floor) {
            this._floor--;
        }
    }

    private currentTarget() {
        return this.targets[0];
    }

    private removeCurrentTarget() {
        this.targets.shift()
    }
}

namespace Lift {

    export interface FloorArrivalHandler {
        arrivedAt(floor: number): void
    }

    export class Boundary {
        private readonly lowerBound: number;
        private readonly upperBound: number;

        constructor(lowerBound: number, upperBound: number) {
            this.lowerBound = lowerBound;
            this.upperBound = upperBound;
        }

        assertInBounds(target: number) {
            if (this.isOutOfBounds(target)) throw new Lift.TargetOutOfBoundsError
        }

        public isOutOfBounds(target: number) {
            return target < this.lowerBound || target > this.upperBound;
        }

    }

    export class TargetOutOfBoundsError extends Error {
    }
}

export {Lift}