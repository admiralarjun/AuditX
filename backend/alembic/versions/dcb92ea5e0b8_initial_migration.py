"""Initial migration

Revision ID: dcb92ea5e0b8
Revises: 
Create Date: 2023-09-11 16:37:31.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dcb92ea5e0b8'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create ssh_creds table if it doesn't exist
    op.create_table('ssh_creds',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('ssh_username', sa.String(), nullable=False),
    sa.Column('ssh_password', sa.String(), nullable=True),
    sa.Column('ssh_pem_path', sa.String(), nullable=True),
    sa.Column('ssh_ip', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )

    # Create winrm_creds table if it doesn't exist
    op.create_table('winrm_creds',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('winrm_username', sa.String(), nullable=False),
    sa.Column('winrm_password', sa.String(), nullable=False),
    sa.Column('winrm_hostname', sa.String(), nullable=False),
    sa.Column('winrm_port', sa.Integer(), nullable=False),
    sa.Column('use_ssl', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )

    # Use batch operations to modify the platforms table
    with op.batch_alter_table('platforms', schema=None) as batch_op:
        batch_op.add_column(sa.Column('winrm_creds_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('ssh_creds_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key('fk_platforms_winrm_creds', 'winrm_creds', ['winrm_creds_id'], ['id'])
        batch_op.create_foreign_key('fk_platforms_ssh_creds', 'ssh_creds', ['ssh_creds_id'], ['id'])

    # Drop the 'attributes' table if it exists
    op.drop_table('attributes')


def downgrade():
    # Use batch operations to revert changes to the platforms table
    with op.batch_alter_table('platforms', schema=None) as batch_op:
        batch_op.drop_constraint('fk_platforms_ssh_creds', type_='foreignkey')
        batch_op.drop_constraint('fk_platforms_winrm_creds', type_='foreignkey')
        batch_op.drop_column('ssh_creds_id')
        batch_op.drop_column('winrm_creds_id')

    # Drop the winrm_creds table
    op.drop_table('winrm_creds')

    # Drop the ssh_creds table
    op.drop_table('ssh_creds')

    # Recreate the 'attributes' table if needed
    op.create_table('attributes',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('name', sa.VARCHAR(), nullable=True),
    sa.Column('value', sa.VARCHAR(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_attributes_name', 'attributes', ['name'], unique=False)