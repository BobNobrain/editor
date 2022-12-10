// https://rawgit.com/w3c/input-events/v1/index.html#interface-InputEvent-Attributes
export enum InputType {
    InsertText = 'insertText',
    InsertReplacementText = 'insertReplacementText',
    InsertLineBreak = 'insertLineBreak',
    InsertParagraph = 'insertParagraph',
    InsertOrderedList = 'insertOrderedList',
    InsertUnorderedList = 'insertUnorderedList',
    InsertHorizontalRule = 'insertHorizontalRule',
    InsertFromYank = 'insertFromYank',
    InsertFromDrop = 'insertFromDrop',
    InsertFromPaste = 'insertFromPaste',
    InsertFromPasteAsQuotation = 'insertFromPasteAsQuotation',
    InsertTranspose = 'insertTranspose',
    InsertCompositionText = 'insertCompositionText',
    InsertLink = 'insertLink',
    DeleteWordBackward = 'deleteWordBackward',
    DeleteWordForward = 'deleteWordForward',
    DeleteSoftLineBackward = 'deleteSoftLineBackward',
    DeleteSoftLineForward = 'deleteSoftLineForward',
    DeleteEntireSoftLine = 'deleteEntireSoftLine',
    DeleteHardLineBackward = 'deleteHardLineBackward',
    DeleteHardLineForward = 'deleteHardLineForward',
    DeleteByDrag = 'deleteByDrag',
    DeleteByCut = 'deleteByCut',
    DeleteContent = 'deleteContent',
    DeleteContentBackward = 'deleteContentBackward',
    DeleteContentForward = 'deleteContentForward',
    HistoryUndo = 'historyUndo',
    HistoryRedo = 'historyRedo',
    FormatBold = 'formatBold',
    FormatItalic = 'formatItalic',
    FormatUnderline = 'formatUnderline',
    FormatStrikeThrough = 'formatStrikeThrough',
    FormatSuperscript = 'formatSuperscript',
    FormatSubscript = 'formatSubscript',
    FormatJustifyFull = 'formatJustifyFull',
    FormatJustifyCenter = 'formatJustifyCenter',
    FormatJustifyRight = 'formatJustifyRight',
    FormatJustifyLeft = 'formatJustifyLeft',
    FormatIndent = 'formatIndent',
    FormatOutdent = 'formatOutdent',
    FormatRemove = 'formatRemove',
    FormatSetBlockTextDirection = 'formatSetBlockTextDirection',
    FormatSetInlineTextDirection = 'formatSetInlineTextDirection',
    FormatBackColor = 'formatBackColor',
    FormatFontColor = 'formatFontColor',
    FormatFontName = 'formatFontName',
}

export function isFormattingInputType(inputType: string): boolean {
    return inputType.startsWith('format');
}
export function isHistoryInputType(inputType: string): boolean {
    return inputType.startsWith('history');
}
export function isInsertionInputType(inputType: string): boolean {
    return inputType.startsWith('insert');
}
export function isDeletionInputType(inputType: string): boolean {
    return inputType.startsWith('delete');
}
