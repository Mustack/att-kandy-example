import React from 'react';
import styles from './app.css';

export default React.createClass({
    render() {
        return (
            <div className={styles.app}>
                <header className={styles.header}>AT&amp;T Enhanced WebRTC and Kandy Demo</header>
                <div className={styles.container}>
                    {this.props.children}
                </div>
                <footer className={styles.footer}>Powered by AT&amp;T and Kandy.</footer>
            </div>
        );
    }
});
