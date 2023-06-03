export const parseTags = (tags: string) => {
    //remove all whitespace and split by #
    let parsedTags = tags.replace(/\s/g, "").split("#");
    //remove empty strings, and prepend # to each tag
    parsedTags = parsedTags.filter((tag) => tag !== "").map((tag) => `#${tag}`);
    return parsedTags;
};

export const parseDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

}