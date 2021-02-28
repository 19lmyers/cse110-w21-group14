describe('Timer Tests', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500/');
    });
  
    it('First Test', () => {
        expect(true).to.equal(true);
    });
});