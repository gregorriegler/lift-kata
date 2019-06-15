class Lift {
    private target: number;
    private _floor: number;
    private boundary: Lift.Boundary;

    constructor(lowerBound?: number, upperBound?: number) {
        this.boundary = new Lift.Boundary(
            lowerBound !== undefined ? lowerBound : -1,
            upperBound !== undefined ? upperBound : 3
        )
        this.target = 0;
        this._floor = 0;
    }

    floor() {
        return this._floor
    }

    registerTarget(target: number) {
        this.boundary.assertInBounds(target)
        this.target = target
    }

    tick(times?: number) {
        if (times === undefined) times = 1
        for (let i = 0; i < times; i++)
            this._tick()
    }

    private _tick() {
        if (this.target > this._floor) {
            this._floor++;
        } else if (this.target < this._floor) {
            this._floor--;
        }
    }
}

namespace Lift {
    export class Boundary {
        private readonly lowerBound: number;
        private readonly upperBound: number;

        constructor(lowerBound: number, upperBound: number) {
            this.lowerBound = lowerBound;
            this.upperBound = upperBound;
        }

        public assertInBounds(target: number) {
            if (this.isOutOfBounds(target)) throw new Lift.Boundary.TargetOutOfBoundsError
        }

        public isOutOfBounds(target: number) {
            return target < this.lowerBound || target > this.upperBound;
        }

        static TargetOutOfBoundsError = class extends Error {}
    }
}

export {Lift}