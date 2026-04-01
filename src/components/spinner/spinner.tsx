function Spinner(): JSX.Element {
  return (
    <div
      style={{
        fontSize: '28px',
        fontWeight: 500,
        color: '#4481c3',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
      }}
    >
      Loading...
    </div>
  );
}

export default Spinner;
