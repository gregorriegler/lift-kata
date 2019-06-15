import FloorArrivalHandler = Lift.FloorArrivalHandler;

class Lift {
    private readonly boundary: Lift.Boundary;
    private readonly targets: number[] = [];
    private _floor: number = 0;
    private arrivalHandlers: FloorArrivalHandler[] = [];

    constructor(lowerBound: number, upperBound: number, ...handlers: FloorArrivalHandler[]) {
        this.boundary = new Lift.Boundary(lowerBound, upperBound)
        handlers.forEach(handler => this.arrivalHandlers.push(handler))
    }

    floor() {
        return this._floor
    }

    goto(floor: number) {
        this.registerTarget(floor, this.currentDirection());
    }

    call(floor: number, direction: Lift.Direction) {
        this.registerTarget(floor, direction);
    }

    private registerTarget(floor: number, direction: Lift.Direction) {
        this.boundary.assertWithinBounds(floor)

        if (this.isOnMyWay(floor, direction)) {
            this.intermediateTarget(floor)
        } else {
            this.targets.push(floor)
        }
    }

    tick(times?: number) {
        if (times === undefined) times = 1
        for (let i = 0; i < times; i++)
            this._tick()
    }

    private isOnMyWay(floor: number, direction: Lift.Direction) {
        return this.isCurrentDirection(direction) &&
            (
                direction === Lift.Direction.Up && floor >= this._floor ||
                direction === Lift.Direction.Down && floor <= this._floor
            )
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
        if (this.goingUp()) {
            this._floor++;
        } else if (this.goingDown()) {
            this._floor--;
        }
    }

    private goingUp() {
        return this.currentTarget() > this._floor;
    }

    private goingDown() {
        return this.currentTarget() < this._floor;
    }

    private currentTarget() {
        return this.targets[0];
    }

    private removeCurrentTarget() {
        this.targets.shift()
    }

    private isCurrentDirection(direction: Lift.Direction) {
        return direction === this.currentDirection();
    }

    private currentDirection(): Lift.Direction {
        if (this._floor < this.currentTarget()) {
            return Lift.Direction.Up
        } else {
            return Lift.Direction.Down
        }
    }

    private intermediateTarget(floor: number) {
        let index = 0;
        while (index < this.targets.length) {
            if (this.goingUp() && this.targets[index] > floor ||
                this.goingDown() && this.targets[index] < floor) break
            index++
        }

        this.targets.splice(index, 0, floor)
    }
}

namespace Lift {

    export enum Direction {
        Up, Down
    }

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

        assertWithinBounds(target: number) {
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