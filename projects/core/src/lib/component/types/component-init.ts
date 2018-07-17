import { Abstract } from '../../fields/abstract/abstract';

export interface ComponentInit {
    performOnInit(field: Abstract): void;
}
