import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose, lifecycle } from 'recompose';
import numeral from 'numeral';

import { requestBottomSymbols, requestTopSymbols } from 'src/actions/api';

const textStyle = {
  fontSize: 28,
};

const SymbolTableRow = ({ style = {}, children }) => (
  <div style={{ display: 'flex', flex: 1, ...textStyle, ...style }}>
    {children}
  </div>
);

const SymbolTable = ({ label, data, style }) => (
  <div style={{ paddingLeft: 20, paddingRight: 20, ...style }}>
    <div
      style={{
        width: '80vw',
        maxWidth: 300,
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
      }}
    >
      <h2 style={{ textAlign: 'center', fontSize: 34, fontWeight: 'bold' }}>
        {label}
      </h2>
      {data.map(({ symbol, popularity }, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
        >
          <SymbolTableRow style={{ flex: 0.5 }}>{i + 1}</SymbolTableRow>
          <SymbolTableRow>
            <Link to={`/symbol/${symbol}`}>
              {<span style={textStyle}>{symbol}</span>}
            </Link>
          </SymbolTableRow>
          <SymbolTableRow>{numeral(popularity).format('0,0')}</SymbolTableRow>
        </div>
      ))}
    </div>
  </div>
);

const Leaderboard = ({ bottomSymbols, topSymbols }) => {
  if (!bottomSymbols || !topSymbols) {
    return <div>Loading...</div>;
  }

  const symbolTableStyle = {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  };

  return (
    <div
      style={{ display: 'flex', flex: 1, flexWrap: 'wrap', paddingBottom: 50 }}
    >
      <SymbolTable
        label="Most Popular Assets"
        data={topSymbols}
        style={symbolTableStyle}
      />
      <SymbolTable
        label="Least Popular Assets"
        data={bottomSymbols}
        style={symbolTableStyle}
      />
    </div>
  );
};

const mapStateToProps = ({ api: { bottomSymbols, topSymbols } }) => ({
  bottomSymbols,
  topSymbols,
});

export default compose(
  connect(mapStateToProps, { requestBottomSymbols, requestTopSymbols }),
  lifecycle({
    componentWillMount() {
      this.props.requestBottomSymbols();
      this.props.requestTopSymbols();
    },
  })
)(Leaderboard);