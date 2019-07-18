// A style sheet

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10px',
        marginBottom: '10px'
    },
    button: {
        margin: '2px'
    },
    input: {
        display: 'none',
    },
    rootBottom : {
        color: 'black',
        labelColor: 'black',
        width: '100%',
        position: 'fixed',
        bottom: 0,
    },
    bottomAction: {
      color: '#0061ff'
    },

    icon: {
        fontSize: '25px',
        marginBottom: '10px'
    }
});

export default styles;

