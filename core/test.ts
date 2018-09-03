import { Form } from './storage/form';
import { timer } from 'rxjs';
import { ListField } from './storage/states/list-field';

const form: Form = new Form(
    {
        type: 'GROUP',
        name: 'GROUP',
        layout: undefined,
        children: {
            c1: {
                type: 'CONTROL',
                label: 'test',
                defaultValue: 2
            },
            g2: {
                type: 'GROUP',
                layout: undefined,
                children: {
                    c2: {
                        type: 'CONTROL',
                        label: 't2'
                    }
                }
            },
            a1: {
                type: 'LIST',
                childDefinition: {
                    type: 'GROUP',
                    layout: undefined,
                    children: {
                        c4: {
                            type: 'CONTROL',
                            label: 'test3'
                        }
                    }
                }
            }
        }
    },
    {
        c1: 3,
        g2: {
            c2: 44
        },
        a1: [{ c4: 4 }, { c4: 6 }]
    }
);
form.store.select().subscribe(() => console.log('NEW STATE'));
form.store
    .getEntityManager('GROUP')
    .select('value')
    .subscribe(console.log);

// form.store
//     .select((state: FormState) => Object.keys(state.entities))
//     .subscribe(console.log);

timer(2000).subscribe(() => {
    form.store
        .getEntityManager<ListField>('GROUP/a1')
        .get((list: ListField) => list.push({ c4: 8 }));
});

timer(4000).subscribe(() => {
    form.store
        .getEntityManager<ListField>('GROUP/a1')
        .get((list: ListField) => list.removeAtIndex(1));
});
