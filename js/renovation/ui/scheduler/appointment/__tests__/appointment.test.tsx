import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Widget } from '../../../common/widget';
import { viewFunction as ViewFunction, Appointment, AppointmentProps } from '../appointment';
import { AppointmentContent } from '../content/layout';
import { AppointmentViewModel, ReduceType } from '../types';

describe('Appointment', () => {
  const defaultViewModel: AppointmentViewModel = {
    key: '1-2-10-20',

    appointment: {
      startDate: new Date('2021-08-05T10:00:00.000Z'),
      endDate: new Date('2021-08-05T12:00:00.000Z'),
      text: 'Some text',
    },

    geometry: {
      empty: false,
      left: 1,
      top: 2,
      width: 10,
      height: 20,
      leftVirtualWidth: 1,
      topVirtualHeight: 2,
    },

    info: {
      allDay: false,
      isRecurrent: false,
      direction: 'vertical',
      appointment: {
        startDate: new Date('2021-08-05T10:00:00.000Z'),
        endDate: new Date('2021-08-05T12:00:00.000Z'),
      },
      sourceAppointment: {
        groupIndex: 1,
      },
      dateText: '1AM - 2PM',
      resourceColor: '#1A2BC',
    },
  };

  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(
      <ViewFunction
        {...viewModel}
        props={{
          viewModel: defaultViewModel,
          ...viewModel.props,
        }}
      />,
    );

    it('it should has correct render', () => {
      const appointment = render({
        styles: 'some-styles',
        classes: 'some-classes',
        text: 'some Text',
        isReduced: true,
        data: { data: 'someData' },
        dateText: 'some dateText',
        props: {
          viewModel: {
            info: {
              isRecurrent: true,
            },
          },
          index: 123,
          showReducedIconTooltip: 'test value 1',
          hideReducedIconTooltip: 'test value 2',
          appointmentTemplate: 'some template',
        },
      });

      expect(appointment.is(Widget))
        .toBe(true);

      expect(appointment.prop('classes'))
        .toBe('some-classes');

      expect(appointment.prop('style'))
        .toEqual('some-styles');

      expect(appointment.prop('hint'))
        .toEqual('some Text');

      const content = appointment.childAt(0);

      expect(content.type())
        .toBe(AppointmentContent);

      expect(content.props())
        .toEqual({
          text: 'some Text',
          isReduced: true,
          dateText: 'some dateText',
          isRecurrent: true,
          index: 123,
          data: { data: 'someData' },
          showReducedIconTooltip: 'test value 1',
          hideReducedIconTooltip: 'test value 2',
          appointmentTemplate: 'some template',
        });
    });
  });

  describe('Behavior', () => {
    describe('Methods', () => {
      describe('onItemClick', () => {
        it('should call onItemClick prop with correct arguments', () => {
          const mockCallback = jest.fn();
          const appointment = new Appointment({
            viewModel: defaultViewModel,
            index: 2021,
            onItemClick: mockCallback,
          } as any);
          appointment.ref = {
            current: 'element',
          } as any;

          appointment.onItemClick();

          expect(mockCallback).toBeCalledTimes(1);

          expect(mockCallback).toHaveBeenCalledWith({
            data: [defaultViewModel],
            target: 'element',
            index: 2021,
          });
        });
      });
    });
  });

  describe('Logic', () => {
    describe('AppointmentProps', () => {
      it('should be correctly initialize default props', () => {
        expect(new AppointmentProps())
          .toEqual({
            index: 0,
          });
      });
    });

    describe('Getters', () => {
      describe('styles', () => {
        it('should return correct styles', () => {
          const appointment = new Appointment({
            viewModel: defaultViewModel,
          } as any);

          expect(appointment.styles)
            .toEqual({
              backgroundColor: '#1A2BC',
              height: '20px',
              left: '1px',
              top: '2px',
              width: '10px',
            });
        });
      });

      describe('classes', () => {
        it('should return correct class names with vertical appointment direction', () => {
          const appointment = new Appointment({
            viewModel: {
              ...defaultViewModel,
              info: {
                ...defaultViewModel.info,
                direction: 'vertical',
              },
            },
          } as any);

          expect(appointment.classes)
            .toBe('dx-scheduler-appointment dx-scheduler-appointment-vertical');
        });

        it('should return correct class names with horizontal appointment direction', () => {
          const appointment = new Appointment({
            viewModel: {
              ...defaultViewModel,
              info: {
                ...defaultViewModel.info,
                direction: 'horizontal',
              },
            },
          } as any);

          expect(appointment.classes)
            .toBe('dx-scheduler-appointment dx-scheduler-appointment-horizontal');
        });

        it('should return correct class with recurrence', () => {
          const appointment = new Appointment({
            viewModel: {
              ...defaultViewModel,
              info: {
                ...defaultViewModel.info,
                isRecurrent: true,
              },
            },
          } as any);

          const defaultClasses = 'dx-scheduler-appointment dx-scheduler-appointment-vertical';

          expect(appointment.classes.search(`${defaultClasses} dx-scheduler-appointment-recurrence`) >= 0)
            .toBe(true);
        });

        it('should return correct class with allDay', () => {
          const appointment = new Appointment({
            viewModel: {
              ...defaultViewModel,
              info: {
                ...defaultViewModel.info,
                allDay: true,
              },
            },
          } as any);

          const defaultClasses = 'dx-scheduler-appointment dx-scheduler-appointment-vertical';

          expect(appointment.classes)
            .toBe(`${defaultClasses} dx-scheduler-all-day-appointment`);
        });

        (['head', 'body', 'tail'] as ReduceType[]).forEach((appointmentReduced) => {
          it(`should return correct class if ${appointmentReduced} is reduced`, () => {
            const appointment = new Appointment({
              viewModel: {
                ...defaultViewModel,
                info: {
                  ...defaultViewModel.info,
                  appointmentReduced,
                },
              },
            } as any);

            const defaultClasses = 'dx-scheduler-appointment dx-scheduler-appointment-vertical';

            expect(appointment.classes)
              .toBe(`${defaultClasses} dx-scheduler-appointment-reduced dx-scheduler-appointment-${appointmentReduced}`);
          });
        });
      });

      describe('text', () => {
        it('should return correct text', () => {
          const appointment = new Appointment({
            viewModel: defaultViewModel,
          } as any);

          expect(appointment.text)
            .toBe('Some text');
        });
      });

      describe('dateText', () => {
        it('should return correct dateText', () => {
          const appointment = new Appointment({
            viewModel: defaultViewModel,
          } as any);

          expect(appointment.dateText)
            .toBe('1AM - 2PM');
        });
      });

      describe('data', () => {
        it('shoud return correct data', () => {
          const appointment = new Appointment({
            viewModel: defaultViewModel,
          } as any);

          expect(appointment.data)
            .toEqual({
              appointmentData: {
                startDate: new Date('2021-08-05T10:00:00.000Z'),
                endDate: new Date('2021-08-05T12:00:00.000Z'),
              },
              targetedAppointmentData: {
                startDate: new Date('2021-08-05T10:00:00.000Z'),
                endDate: new Date('2021-08-05T12:00:00.000Z'),
                text: 'Some text',
              },
            });
        });
      });

      describe('isReduced', () => {
        it('should be false by default', () => {
          const appointment = new Appointment({
            viewModel: defaultViewModel,
          } as any);

          expect(appointment.isReduced)
            .toBe(false);
        });

        (['head', 'body', 'tail'] as ReduceType[]).forEach((appointmentReduced) => {
          it(`shoud have correct value if appointment ${appointmentReduced} is reduced`, () => {
            const appointment = new Appointment({
              viewModel: {
                ...defaultViewModel,
                info: {
                  ...defaultViewModel.info,
                  appointmentReduced,
                },
              },
            } as any);

            expect(appointment.isReduced)
              .toBe(true);
          });
        });
      });
    });
  });
});
