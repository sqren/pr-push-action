import { runAction } from './runAction';
import { getMockPayload } from './test/payloadMock';
import * as exec from '@actions/exec';
import { Inputs } from '.';

describe('runAction', () => {
  it('assa', async () => {
    const spy = jest.spyOn(exec, 'exec').mockImplementation((...args) => {
      console.log('args:', args);
    });
    const payload = getMockPayload('bump please');
    const actor = 'sqren';
    const inputs: Inputs = {
      command: 'yarn bump',
      comment: 'bump please',
    };
    await runAction(payload, actor, inputs);

    console.log('start asserting');

    expect(spy).toHaveBeenCalledTimes(6);
    expect(spy.mock.calls[0][0]).toMatchInlineSnapshot(`"git"`);
    expect(spy.mock.calls[1][0]).toMatchInlineSnapshot(`"git"`);

    expect(spy.mock.calls[2]).toEqual(['yarn', ['bump']]);
    expect(spy.mock.calls[3]).toEqual(['git', ['add', '-u']]);
    expect(spy.mock.calls[4]).toEqual([
      'git',
      ['commit', '-m', 'Result of "yarn bump"'],
    ]);
    expect(spy.mock.calls[5]).toEqual(['git', ['push']]);
  });
});
