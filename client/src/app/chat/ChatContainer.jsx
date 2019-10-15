/* eslint-disable eqeqeq */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  List, makeStyles,
} from '@material-ui/core';
import Message from './components/Message';
import { Field } from '../shared/ui';
import { useForm, useField } from '../shared/hooks';
import { selectors } from './reducer';
import { fetchMessages, sendMessage } from './actions';
import { selectors as authSelectors } from '../auth';

const validationList = [
  fdata => fdata.msg.length > 250 && 'max length 250',
];

const useStyles = makeStyles(() => ({
  root: {
    
  },
  field: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  list: {
    height: '80vh',
    overflowY: 'scroll',
  },
}));

function ChatContainer({
  match,
  onFetchMessages,
  onSendMessage,
  userId,
  messages,
  avatar,
}) {
  const classes = useStyles();
  const form = useForm(null);
  const field = useField('msg', form, { validations: validationList });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (field.value.length < 250) {
      onSendMessage(match.params.id, field.value);
      field.setValue('');
    }
  };

  useEffect(() => {
    onFetchMessages(match.params.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const msgs = messages.map(msg => (
    <Message
      key={msg.id}
      body={msg.message}
      avatarUrl={avatar}
      self={msg.author == userId}
    />
  ));

  return (
    <div>
      <List className={classes.list}>
        {msgs}
      </List>
      <form
        className={classes.field}
        onSubmit={e => handleSubmit(e)}
      >
        <Field {...field} fullWidth variant="filled" />
      </form>
    </div>
  );
}

const mapStateToProps = state => ({
  targetId: selectors.getUserId(state),
  messages: selectors.getMessages(state),
  userId: authSelectors.getUserId(state),
  avatar: selectors.getAvatar(state),
});

const mapDispatchToProps = dispatch => ({
  onFetchMessages: id => dispatch(fetchMessages(id)),
  onSendMessage: (id, msg) => dispatch(sendMessage(id, msg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);
