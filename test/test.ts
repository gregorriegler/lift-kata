import {Lift} from "../src/lift";
import {expect} from "chai";
import FloorArrivalHandler = Lift.FloorArrivalHandler;

describe('Lift', function () {
    let lift: Lift;
    let fakeArrivalHandler: FakeArrivalHandler;

    beforeEach(function () {
        fakeArrivalHandler = new FakeArrivalHandler();
        lift = new Lift(-1, 3, fakeArrivalHandler)
    });

    it('is limited to shafts upper boundary', function () {
        expect(() => lift.registerTarget(4))
            .to.throw(Lift.TargetOutOfBoundsError)
    });

    it('is limited to shafts lower boundary', function () {
        expect(() => lift.registerTarget(-2))
            .to.throw(Lift.TargetOutOfBoundsError)
    });

    it('starts at 0', function () {
        expect(lift.floor()).to.equal(0);
    });

    it('can go up a floor', function () {
        lift.registerTarget(1);

        lift.tick();

        expect(lift.floor()).to.equal(1);
    });

    it('can go down a floor', function () {
        lift.registerTarget(-1);

        lift.tick();

        expect(lift.floor()).to.equal(-1);
    });

    it('goes one floor per tick', function () {
        lift.registerTarget(2);

        lift.tick();

        expect(lift.floor()).to.equal(1);
    });

    it('stops at target', function () {
        lift.registerTarget(2);

        lift.tick(3);

        expect(lift.floor()).to.equal(2);
    });

    it('notifies for arrival on target floor', function () {
        lift.registerTarget(2);

        lift.tick(2);

        expect(fakeArrivalHandler.arrivals).to.have.members([2])
    });

    it('doesnt notify while driving', function () {
        lift.registerTarget(2);

        lift.tick(1);

        expect(fakeArrivalHandler.arrivals).to.be.empty
    });

    it('can register 2 targets', function () {
        lift.registerTarget(1);
        lift.registerTarget(3);

        lift.tick(3);

        expect(fakeArrivalHandler.arrivals).to.have.members([1, 3])
    });

    class FakeArrivalHandler implements FloorArrivalHandler {
        public arrivals: number[] = [];

        arrivedAt(floor: number): void {
            this.arrivals.push(floor);
        }

    }

});