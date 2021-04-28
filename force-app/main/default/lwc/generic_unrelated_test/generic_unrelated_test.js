/*
    This component is for testing out the behavior of HTML, LWC, etc. to ensure we get the appropriate behavior for the generic LWC Interface. Each LWC I make can be made to interact with other components through these relationships. This relationship is for an unrelated component that may be on the same page, but must be communicated with through the lightning message channel.
*/

import { LightningElement } from 'lwc';

export default class Generic_unrelated_test extends LightningElement {}