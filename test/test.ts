import {Lift} from "../src/lift";
import {expect} from "chai";

describe('Lift', function () {
    let lift:Lift;

    beforeEach(function () {
        lift = new Lift()
    })

    it('starts at 0', function () {
        expect(lift.floor()).to.equal(0);
    })

    it('can go up a floor', function () {
        lift.registerTarget(1);

        lift.tick();

        expect(lift.floor()).to.equal(1);
    })

    it('can go down a floor', function () {
        lift.registerTarget(-1);

        lift.tick();

        expect(lift.floor()).to.equal(-1);
    })

    it('goes one floor per tick', function () {
        lift.registerTarget(2);

        lift.tick();

        expect(lift.floor()).to.equal(1);
    })

    it('stops at target', function () {
        lift.registerTarget(2);

        lift.tick(3);

        expect(lift.floor()).to.equal(2);
    })

    it('is limited to shafts upper boundary', function () {
        let boundedLift = new Lift(0, 3);

        expect(() => boundedLift.registerTarget(4))
            .to.throw(Lift.Boundary.TargetOutOfBoundsError)
    })

    it('is limited to shafts lower boundary', function () {
        let boundedLift = new Lift(0, 3);

        expect(() => boundedLift.registerTarget(-1))
            .to.throw(Lift.Boundary.TargetOutOfBoundsError)
    })

})