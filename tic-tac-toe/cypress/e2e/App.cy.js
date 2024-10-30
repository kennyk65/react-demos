
describe('Game E2E', () => {
    it('should allow players to complete a game', () => {
      cy.visit('/');
      cy.contains('Next player: X');
  
      // Simulate X and O moves
      cy.get('.square').eq(0).click();
      cy.contains('Next player: O');
      cy.get('.square').eq(1).click();
      cy.contains('Next player: X');
      cy.get('.square').eq(4).click();
      cy.get('.square').eq(5).click();
      cy.get('.square').eq(8).click();
  
      // Verify that X won
      cy.contains('Winner: X');
    });
  });
  