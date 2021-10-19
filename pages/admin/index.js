import React from 'react';
import Layout from '../../client/layout/Layout';
import {
  Button,
  Container,
  Icon,
  Item
} from 'semantic-ui-react'


export default function AdminIndexPage() {
  return (
    <Layout>
      <Container>
        <Item.Group divided>
          <Item>
            <Item.Image src='/logo.png' />
            <Item.Content>
              <Item.Header as='a'>Moker Server</Item.Header>
              <Item.Description>
                Welcome to Moker Server, you can modify the mock records and create new records.
              </Item.Description>
              <Item.Extra>
                <Button primary floated='right'>
                  Go to Library
                  <Icon name='chevron right' />
                </Button>
              </Item.Extra>
            </Item.Content>
          </Item>
          <Item>
            <Item.Image src='/logo.png' />
            <Item.Content>
              <Item.Header as='a'>Moker Chrome Extension</Item.Header>
              <Item.Description>
                Use the extension to redirect the "marked" requests to the Moker Server.
              </Item.Description>
              <Item.Extra>
                <Button primary floated='right'>
                  Chrome Extension Store
                  <Icon name='chevron right' />
                </Button>
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
      </Container>
    </Layout>
  )
}