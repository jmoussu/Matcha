import { connect } from 'react-redux';
import { autoSign } from './actions';

function AutoSign({ onAutoSign }) {
  const tkn = localStorage.getItem('token');
  if (tkn) {
    onAutoSign(tkn);
  }
  return (null);
}

const mapDispatchToProps = dispatch => ({
  onAutoSign: tkn => dispatch(autoSign(tkn)),
});

export default connect(null, mapDispatchToProps)(AutoSign);
