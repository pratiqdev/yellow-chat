const defaultState = {
  step: 3,
  username: 'Tester',
  activeChannel: 'chat',
  channelMap: {
    'chat': {
      messages: [],
      users: [],
      text: '',
    }
  },
  showSetupModal: true,
  showChannelMenu: false,
  showChannelModal: false,
  showUsernameModal: false,
}

describe('New user', () => {
  it('can setup a username and first chat via setup', () => {
    // vite preview uses port 4173
    cy.visit('localhost:4173')
    cy.viewport(1400, 800)

    // Type into the input field
    cy.get('#step-1-input').type('Shlep');
  
    // Click the next button
    cy.get('#step-1-next').click();

    // create a new channel
    cy.get('#step-2-input').clear().type('new-chat-1234')

    cy.get('#step-2-close').click()

    cy.get('#chat-window-channel-name').invoke('text').then((text) => {
      // Assert that the text contains the expected substring
      expect(text.trim()).contain('#new-chat-1234')
    });
  })

  it('can edit username from ui', () => {
    // vite preview uses port 4173
    cy.visit('localhost:4173')
    cy.viewport(1400, 800)
    cy.setLocalStorage('pratiqdev_yellowchat_state', JSON.stringify(defaultState))


    cy.get('#chat-window-current-user').invoke('text').then((text) => {
      // Assert that the text contains the expected substring
      expect(text.trim()).contain(defaultState.username)
    });

    cy.get('#chat-window-open-user-modal').click()
    cy.get('#username-modal-input').clear().type('new-name')
    cy.get('#username-modal-update').click()

    cy.get('#chat-window-current-user').invoke('text').then((text) => {
      // Assert that the text contains the expected substring
      expect(text.trim()).contain('new-name')
    });
  })

  it('can create new channels', () => {
    // vite preview uses port 4173
    cy.visit('localhost:4173')
    cy.viewport(1400, 800)
    cy.setLocalStorage('pratiqdev_yellowchat_state', JSON.stringify(defaultState))

    //open the channel modal
    cy.get('#channel-list-open-channel-modal').click()

    const channelName = 'hfea-fhth-aueb'
    // type the new channel name
    cy.get('#channel-modal-input').clear().type(channelName)
    cy.get('#channel-modal-update').click()
    
    cy.get('#channel-list-list-container').invoke('text').then((text) => {
      // Assert that the text contains the expected substring
      expect(text.trim()).contain(channelName)
    });
  })

  it('can delete existing channels', () => {
    // vite preview uses port 4173
    cy.visit('localhost:4173')
    cy.viewport(1400, 800)
    cy.setLocalStorage('pratiqdev_yellowchat_state', JSON.stringify(defaultState))

    
    cy.get('#channel-list-list-container').invoke('text').then((text) => {
      // Assert that the text contains the expected substring
      expect(text.trim()).contain('#chat')
    });
    
    // there seems to be a delay 
    cy.wait(1000)
    cy.get('#channel-item-delete').click()
    cy.wait(1000)


    cy.get('#channel-list-list-container').invoke('text').then((text) => {
      // Assert that the text contains the expected substring
      expect(text.trim()).not.contain('#chat')
    });
  })
})