const errorMsg = 'Sorry Senpai, something went wrong - I\'m so sorry >.< If this happens again contact my developer Kid';

function errorOccurred(err) {
    return errorMsg;
};

function fetchManyMessages(channel, limit) {
    return new Promise((resolve, reject) => {
        channel.messages.fetch({
                limit: limit < 100 ? limit : 100
            })
            .then(collection => {
                const nextBatch = () => {
                    let remaining = limit - collection.size;
                    channel.messages.fetch({
                            limit: remaining < 100 ? remaining : 100,
                            before: collection.lastKey()
                        })
                        .then(next => {
                            let concatenated = collection.concat(next);
                            // resolve when limit is met or when no new msgs were added (reached beginning of channel)
                            if (collection.size >= limit || collection.size == concatenated.size || limit === concatenated.size) return resolve(concatenated);

                            collection = concatenated;
                            nextBatch();
                        })
                        .catch(error => reject(error));
                }
                nextBatch();
            })
            .catch(error => reject(error));
    });
};

function fetchAllMessages(channel) {
    return new Promise((resolve, reject) => {
        channel.messages.fetch({
                limit: 100
            })
            .then(collection => {
                const nextBatch = () => {
                    channel.messages.fetch({
                            limit: 100,
                            before: collection.lastKey()
                        })
                        .then(next => {
                            let concatenated = collection.concat(next);
                            // resolve when limit is met or when no new msgs were added (reached beginning of channel)
                            if (collection.size == concatenated.size) return resolve(concatenated);
                            collection = concatenated;
                            nextBatch();
                        })
                        .catch(error => reject(error));
                }
                nextBatch();
            })
            .catch(error => reject(error));
    });
}

function fetchAllPictureMessages(channel) {
    return new Promise((resolve, reject) => {
        channel.messages.fetch({
                limit: 100
            })
            .then(collection => {
                collection = collection.filter(message => message.attachments.size > 0);
                const nextBatch = () => {
                    channel.messages.fetch({
                            limit: 100,
                            before: collection.lastKey()
                        })
                        .then(next => {
                            next = next.filter(message => message.attachments.size > 0);
                            let concatenated = collection.concat(next);
                            // resolve when limit is met or when no new msgs were added (reached beginning of channel)
                            if (collection.size == concatenated.size) return resolve(concatenated);
                            collection = concatenated;
                            nextBatch();
                        })
                        .catch(error => reject(error));
                }
                nextBatch();
            })
            .catch(error => reject(error));
    });
}

module.exports = {
    errorOccurred : errorOccurred,
    fetchManyMessages : fetchManyMessages,
    fetchAllMessages : fetchAllMessages,
    fetchAllPictureMessages : fetchAllPictureMessages
}