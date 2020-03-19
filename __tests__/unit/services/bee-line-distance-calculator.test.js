const path = require('path');
const HOMEDIR = path.join(__dirname, '..', '..', '..');
const {
    beelineDistanceCalculatorService
} = require(path.join(HOMEDIR, 'src', 'services', 'services.js'));


describe('Test beelineDistanceCalculatorService', () => {

    // Kolkata Coords
    const mockSrcCoords = {
        lat: 22.5697,
        lng: 88.3697
    }

    // Berlin Coords
    const mockDestCoords = {
        lat: 52.5167,
        lng: 13.4
    }

    it('should return distance between two { lat, lng } coords',()=>{
        expect(beelineDistanceCalculatorService(mockSrcCoords,mockDestCoords)).toBe(7031.398575563952);
    })
    
})