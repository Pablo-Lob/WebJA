import React from 'react';
import './ContactForm.css';

const ContactForm = () => (
    <div className="form-card1">
        <div className="form-card2">
            <form className="form" autoComplete="off">
                <p className="form-heading">Get In Touch</p>

                <div className="form-field">
                    <input required placeholder="Name" className="input-field" type="text" name="name" />
                </div>

                <div className="form-field">
                    <input required placeholder="Email" className="input-field" type="email" name="email" />
                </div>

                <div className="form-field">
                    <input required placeholder="Subject" className="input-field" type="text" name="subject" />
                </div>

                <div className="form-field">
          <textarea
              required
              placeholder="Message"
              cols={30}
              rows={3}
              className="input-field"
              name="message"
          ></textarea>
                </div>

                <button className="sendMessage-btn" type="submit">Send Message</button>
            </form>
        </div>
    </div>
);

export default ContactForm;