### Generic Input Controls

Purpose:

- Present user interface control
- Collect user input
- Communicate user input to parent control
- **nothing more**

Controls provide mechanism to communicate error, required, etc. But all validation is done within the parent.

Opposed to 'lifting state', state is mananged by individual components and change is communicated to parent.
This decouples child implementation from parent. Specifically GInputPair\* does whatever and communicates changes to parent. It will use the subfield.id specified by parent ({min: Subfield..., max:{id:'$eq'}});
Effective Child calls parent provided callback `cb($gt:10, $lt:15)`.

This may not be ideal for all situations. I believe it is suitable for harvesting minor record (data entry) from user.
