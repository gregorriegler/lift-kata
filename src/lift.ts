import FloorArrivalHandler = Lift.FloorArrivalHandler;

class Lift {
    private readonly boundary: Lift.Boundary;
    private readonly gotos: number[] = [];
    private readonly calls: number[] = [];
    private _floor: number = 0;
    private arrivalHandlers: FloorArrivalHandler[] = [];

    constructor(lowerBound: number, upperBound: number, ...handlers: FloorArrivalHandler[]) {
        this.boundary = new Lift.Boundary(lowerBound, upperBound)
        handlers.forEach(handler => this.arrivalHandlers.push(handler))
    }

    tick(times?: number) {
        if (times === undefined) times = 1
        for (let i = 0; i < times; i++)
            this._tick()
    }

    floor() {
        return this._floor
    }

    goto(floor: number) {
        this.addTarget(floor, this.currentDirection())
    }

    call(floor: number, direction: Lift.Direction) {
        this.addTarget(floor, direction, this.calls);
    }

    private addTarget(floor: number, direction: Lift.Direction, targets = this.gotos) {
        this.boundary.assertWithinBounds(floor)

        if (this.isOnMyWay(floor, direction)) {
            this.addIntermediateGoto(floor)
        } else {
            targets.push(floor)
        }
    }

    private isOnMyWay(floor: number, direction: Lift.Direction) {
        return (
            direction === Lift.Direction.Up && floor >= this._floor ||
            direction === Lift.Direction.Down && floor <= this._floor
        )
    }

    private addIntermediateGoto(floor: number) {
        let index = 0;
        while (index < this.gotos.length) {
            if (this.goingUp() && this.gotos[index] > floor ||
                this.goingDown() && this.gotos[index] < floor) break
            index++
        }

        this.gotos.splice(index, 0, floor)
    }

    private _tick() {
        this.move();
        this.handleArrival();
    }

    private move() {
        if (this.goingUp()) {
            this._floor++;
        } else if (this.goingDown()) {
            this._floor--;
        }
    }

    private handleArrival() {
        if (this.currentTarget() !== this._floor) return;

        this.removeCurrentTarget()

        for (const handler of this.arrivalHandlers) {
            handler.arrivedAt(this._floor)
        }
    }

    private currentTarget(): number {
        if (this.gotos.length > 0) {
            return this.gotos[0];
        } else {
            return this.calls[0];
        }
    }

    private removeCurrentTarget() {
        if (this.gotos[0] === this._floor)
            this.gotos.shift()

        if (this.calls[0] === this._floor)
            this.calls.shift()
    }

    private goingUp() {
        return this.currentTarget() > this._floor;
    }

    private goingDown() {
        return this.currentTarget() < this._floor;
    }

    private currentDirection(): Lift.Direction {
        if (this.goingUp()) {
            return Lift.Direction.Up
        } else {
            return Lift.Direction.Down
        }
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