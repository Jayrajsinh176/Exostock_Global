const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const randomSuffix = (length) => {
    let result = "";

    for (let i = 0; i < length; i++) {
        result += CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    return result;
};

/**
 * Generates a code (prefix + random alphanumeric suffix), retrying until it
 * doesn't collide with an existing document. By default the whole code is
 * 7 characters; pass suffixLength to set the random part's length instead.
 */
export const generateUniqueCode = async (
    Model,
    field,
    prefix,
    suffixLength = 7 - prefix.length,
) => {
    let code;
    let exists = true;

    while (exists) {
        code = `${prefix}${randomSuffix(suffixLength)}`;
        exists = await Model.exists({ [field]: code });
    }

    return code;
};
