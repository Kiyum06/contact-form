export function validateContactForm(data) {

    const errors = [];

    const validHowOptions = ['School', 'Work', 'Conference', 'Online'];

    const submission = {
        fname: data.fname ? data.fname.trim() : '',
        lname: data.lname ? data.lname.trim() : '',
        jobTitle: data.jobTitle || '',
        company: data.company || '',
        linkedin: data.linkedin || '',
        email: data.email || '',
        how: data.how || '',
        other: data.other || '',
        message: data.message || '',
        mailingList: data.mailingList || '',
        format: data.format || ''
    };

    // First name validation
    if (!submission.fname.trim()) {
        errors.push('First name is required.');
    }

    // Last name validation
    if (!submission.lname.trim()) {
        errors.push('Last name is required.');
    }

    // How we met validation
    if (!validHowOptions.includes(submission.how)) {
        errors.push('Please select a valid option for "How did we meet?"');
    }

    // Mailing list validation
    if (submission.mailingList) {
        if (submission.format !== 'HTML' && submission.format !== 'Text') {
            errors.push('Please choose HTML or Text for the email format.');
        }
    }

    return { errors, submission };

}